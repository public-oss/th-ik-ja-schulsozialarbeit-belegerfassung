describe(`Demo's`, () => {
	it('ecosia.org', (browser) => {
		browser
			.url('https://www.ecosia.org/')
			.waitForElementVisible('body')
			.assert.titleContains('Ecosia')
			.assert.visible('input[type=search]')
			.setValue('input[type=search]', 'nightwatch')
			.assert.visible('button[type=submit]')
			.click('button[type=submit]')
			.axeInject()
			.axeRun()
			.getValue('input[name=q]', function (result) {
				this.assert.equal(result.value, 'nightwatch');
			})
			.end();
	});
});
