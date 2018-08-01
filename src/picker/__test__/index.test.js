import * as module from '../index';

describe('index', () => {
  it('module', () => {
    const Picker = require('../Picker')
    const DatePicker = require('../DatePicker')
    const Portal = require('../Portal')
    const formatTimestamp = require('../utils').formatTimestamp
    expect(Picker.default).toEqual(module.default)
    expect(DatePicker.default).toEqual(module.DatePicker)
    expect(Portal.default).toEqual(module.Portal)
    expect(formatTimestamp).toEqual(module.formatTimestamp)
  });
});