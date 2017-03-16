import { AdventuresInRxPage } from './app.po';

describe('adventures-in-rx App', function() {
  let page: AdventuresInRxPage;

  beforeEach(() => {
    page = new AdventuresInRxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
