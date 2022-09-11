export const SPA_urlChangeListener = `(function () {
	var __mmHistory = window.history;
	var __mmPushState = __mmHistory.pushState;
	var __mmReplaceState = __mmHistory.replaceState;
	

	function __mm__updateUrl(){
		const siteName = document.querySelector('head > meta[property="og:site_name"]');
		const title = siteName || document.querySelector('head > meta[name="title"]') || document.title;
		const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
		


		window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
			{
				type: 'NAV_CHANGE',
				payload: {
					url: location.href,
					title: title,
				}
			}
		));


		window.addEventListener("message",(event)=>{
			window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
			{
				type: event.data.eventAction,
				payload: {
					dAppData:event.data,
				}
			}
		))})

		setTimeout(() => {
			const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
			window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
			{
				type: 'GET_HEIGHT',
				payload: {
					height: height
				}
			}))
		}, 500);
	}

	__mmHistory.pushState = function(state) {
		setTimeout(function () {
			__mm__updateUrl();
		}, 100);
		return __mmPushState.apply(history, arguments);
	};

	__mmHistory.replaceState = function(state) {
		setTimeout(function () {
			__mm__updateUrl();
		}, 100);
		return __mmReplaceState.apply(history, arguments);
	};

	window.onpopstate = function(event) {
		__mm__updateUrl();
	};

	
  })();
`

export const JS_POST_MESSAGE_TO_PROVIDER = (
  message: any,
  origin: any,
) => `(function () {
	try {
		window.postMessage(${JSON.stringify(message)}, '${origin}');
	} catch (e) {
		//Nothing to do
	}
})()`

export const JS_IFRAME_POST_MESSAGE_TO_PROVIDER = (message: any, origin: any) =>
  `(function () {})()`
/** Disable sending messages to iframes for now
 *
`(function () {
	const iframes = document.getElementsByTagName('iframe');
	for (let frame of iframes){

			try {
				frame.contentWindow.postMessage(${JSON.stringify(message)}, '${origin}');
			} catch (e) {
				//Nothing to do
			}

	}
})()`;
 */

const getWebviewUrl = `
	const __getFavicon = function(){
		let favicon = undefined;
		const nodeList = document.getElementsByTagName("link");
		for (let i = 0; i < nodeList.length; i++)
		{
			const rel = nodeList[i].getAttribute("rel")
			if (rel === "icon" || rel === "shortcut icon")
			{
				favicon = nodeList[i]
			}
		}
		return favicon && favicon.href
	}

	window.addEventListener("message",(event)=>{
		window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
		{
			type: event.data.eventAction,
			payload: {
				dAppData:event.data,
			}
		}
	))})
	window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
		{
			type: 'GET_WEBVIEW_URL',
			payload: {
				url: location.href,
				icon: __getFavicon(),
				eth: window.ethereum
			}
		}
	))
	
`

export const JS_WEBVIEW_URL = `
	(function () {
		${getWebviewUrl}
	})();
`
