import { Client } from '@elastic/elasticsearch';
import { appEnvs } from '../config';

const elasticClient = new Client({
  cloud: {
    id: appEnvs.elasticCloudId,
  },
  auth: {
    username: appEnvs.elasticUsername,
    password: appEnvs.elasticPassword,
  },
});

export const createIndex = async (indexName: string) => {
  await elasticClient.indices.create({
    index: indexName,
  });
  console.log('index created');
};

// createIndex('posts')
//   .then(() => console.log('done'))
//   .catch(err => console.log(err));

export default elasticClient;
