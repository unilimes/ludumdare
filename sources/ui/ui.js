import './ui.scss';

export class UI {
    constructor() {
        this.map = {
            onStart: '[data-on="start"]',
            bindName: '[data-bind="name"]'
        };

        $(this.map.onStart).on('click', (event) => { this.onClickStart(event); });
        $(this.map.bindName).on('input', (event) => {
            let value = $(event.currentTarget).val();
            this.onChangeName(event, value);
        });
    }

    onClickStart(event) {
        console.log('Start click');
    }

    onChangeName(event, value) {
        console.log('Name:', value);
    }
}
