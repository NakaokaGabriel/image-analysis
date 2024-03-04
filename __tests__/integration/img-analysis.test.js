const {
  describe,
  test,
  expect
} = require('@jest/globals')

const aws = require('aws-sdk')

aws.config.update({
  region: 'us-east-1'
})

const requestMock = require('../mocks/request.json')
const { main } = require('../../src')

describe('Image analyser test suite', () => {
  test('it should analyse successfully the image returning the results', async () => {
    const expectedText = [
      "99.54% de ser do tipo Alimentos",
      "99.54% de ser do tipo grãos",
      "99.54% de ser do tipo produtos agrícolas",
      "99.20% de ser do tipo arroz",
      "92.74% de ser do tipo arroz vegetal",
      "88.02% de ser do tipo integral",
    ].join('\n')

    const expected = {
      statusCode: 200,
      body: `A imagem tem\n`.concat(expectedText)
    }
    const result = await main(requestMock)

    expect(result).toStrictEqual(expected)
  })

  test('given an empty queryString it should return status code 400', async () => {
    const expected = {
      statusCode: 400,
      body: 'an IMG is required'
    }

    const result = await main({
      queryStringParameters: {}
    })

    expect(result).toStrictEqual(expected)
  })

  test('given an invalid image url it should return status code 500', async () => {
    const expected = {
      statusCode: 500,
      body: 'Internal server Error'
    }

    const result = await main({
      queryStringParameters: {
        imageUrl: 'test'
      }
    })

    expect(result).toStrictEqual(expected)
  })
})