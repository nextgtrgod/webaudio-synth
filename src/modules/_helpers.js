
const getRandom = (min = 0, max = 1) => (Math.random() * (max - min)) + min;


const convertColor = (color) => {
	return {
		toDec: () => {
			if ( color.startsWith('#') ) color = color.slice(1);

			return [
				parseInt(color.slice(0, 2), 16),
				parseInt(color.slice(2, 4), 16),
				parseInt(color.slice(4), 16),
			];
		},
		toHex: () => {
			return (
				'#' +
				color[0].toString(16) + 
				color[1].toString(16) + 
				color[2].toString(16)
			);
		}
	};
};

let VENDOR = 'unknown';

(() => {
	let ua		= window.navigator.userAgent.toLowerCase();
	let msie	= ua.indexOf('msie');
	let trident	= ua.indexOf('trident');
	let edge	= ua.indexOf('edge');
	let moz		= ua.indexOf('firefox');
	let chr		= ua.indexOf('chrome');
	let saf		= ua.indexOf('safari');
	let root	= document.getElementsByTagName('html')[0];


	if (typeof window.orientation !== 'undefined') root.classList.add('mobile-device');


	if (msie > 0 || trident > 0 || edge > 0) {
		VENDOR = 'any-ie';
		root.classList.add(VENDOR);
		return true;

	} else if (moz > 0) {
		VENDOR = 'any-firefox';
		root.classList.add(VENDOR);
		return true;

	} else if (chr > 0) {
		VENDOR = 'any-chrome';
		root.classList.add(VENDOR);
		return true;

	} else if (saf > 0) {
		VENDOR = 'any-safari';
		root.classList.add(VENDOR);
		return true;

	} else {
		return false;
	}

})();



export {
	getRandom,
	convertColor,
	VENDOR
};