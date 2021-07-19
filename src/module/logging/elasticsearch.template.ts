export default {
  index_patterns: 'log-*',
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    index: {
      refresh_interval: '5s',
    },
  },
  mappings: {
    _source: { enabled: true },
    properties: {
      '@timestamp': { type: 'date' },
      message: { type: 'text' },
      host: { type: 'text' },
      tags: { type: 'keyword' },
      level: { type: 'keyword' },
      name: { type: 'keyword' },
      'src.file': { type: 'keyword' },
      'err.name': { type: 'text' },
      'err.message': { type: 'text' },
      'err.stack': { type: 'text' },
      'request.method': { type: 'keyword' },
      'request.url': { type: 'keyword' },
      'request.normalizedUrl': { type: 'keyword' },
      'request.remoteAddress': { type: 'keyword' },
      'request.user': { type: 'keyword' },
      'request.body': { type: 'text' },
      'response.statusCode': { type: 'short' },
      'response.responseTime': { type: 'float' },
    },
  },
};
