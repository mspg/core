export default {
  disallowAttributeConcatenation: true,
  disallowAttributeInterpolation: true,
  disallowBlockExpansion: true,
  disallowClassAttributeWithStaticValue: true,
  disallowClassLiterals: null,
  disallowClassLiteralsBeforeAttributes: null,
  disallowClassLiteralsBeforeIdLiterals: true,
  disallowDuplicateAttributes: true,
  disallowHtmlText: true,
  disallowIdAttributeWithStaticValue: true,
  disallowIdLiterals: null,
  disallowIdLiteralsBeforeAttributes: null,
  disallowMultipleLineBreaks: true,
  disallowSpaceAfterCodeOperator: null,
  disallowSpacesInsideAttributeBrackets: null,
  disallowSpecificAttributes: [{ a: 'name' }],
  disallowSpecificTags: null,
  disallowStringConcatenation: true,
  disallowStringInterpolation: true,
  disallowTagInterpolation: true,
  maximumNumberOfLines: null,
  requireClassLiteralsBeforeAttributes: true,
  requireClassLiteralsBeforeIdLiterals: true,
  requireIdLiteralsBeforeAttributes: true,
  requireLineFeedAtFileEnd: true,
  requireLowerCaseAttributes: true,
  requireLowerCaseTags: true,
  requireSpaceAfterCodeOperator: true,
  requireSpacesInsideAttributeBrackets: null,
  requireSpecificAttributes: [
    { form: 'action' },
    // { img: 'alt || role' }, // not working (yet?)
    { input: 'type' },
    { 'input[type=submit]': 'value' },
  ],
  requireStrictEqualityOperators: true,
  validateAttributeQuoteMarks: "'",
  validateAttributeSeparator: {
    separator: ' ',
    multiLineSeparator: '\n  ',
  },
  validateDivTags: true,
  validateExtensions: true,
  validateIndentation: 2,
  validateLineBreaks: 'LF',
  validateSelfClosingTags: true,
}
