import { defaultSettings as settings } from './_paramSettings';

import Knob from './Knob';
import List from './List';
import Input from './Input';
import Options from './Options';


export default class ControlItem {
	constructor(controlsDescription, changeStoreParam) {

		this.controlsDescription = controlsDescription;
		this.changeStoreParam = changeStoreParam;

		this.controlsItems = [];

		this.init();
	}

	init = () => {

		let ctrl = this.controlsDescription;

		switch (ctrl.type) {
			case 'knob':
				this.controlsItems.push(new Knob(
					ctrl.id,
					ctrl.options,
					settings[ctrl.id],
					this.changeStoreParam
				));
				break;
			case 'list':
				this.controlsItems.push(new List(
					ctrl.id,
					settings[ctrl.id],
					this.changeStoreParam
				));
				break;
			case 'input':
				this.controlsItems.push(new Input(
					ctrl.id,
					settings[ctrl.id],
					this.changeStoreParam
				));
				break;
			case 'options':
				this.controlsItems.push(new Options(
					ctrl.id,
					settings[ctrl.id],
					this.changeStoreParam
				));
		};

	}
}