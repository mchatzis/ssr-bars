/// <reference path="./.sst/platform/config.d.ts" />

const dynamoTableArgs: sst.aws.DynamoArgs = {
  fields: {
    PK: "string",
    SK: "string",
    GSI1_PK: "string",
    GSI1_SK: "string",
  },
  primaryIndex: { hashKey: "PK", rangeKey: "SK" },
  globalIndexes: {
    GSI1: { hashKey: "GSI1_PK", rangeKey: "GSI1_SK" },
  },
  deletionProtection: true,
};

export default $config({
  app(input) {
    return {
      name: "ssr-bars",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          version: "6.57.0",
          region: 'eu-central-1',
        },
      },
      version: "3.2.50"
    };
  },
  async run() {
    const dynamoTable = new sst.aws.Dynamo("DynamoTable", dynamoTableArgs);
    const dynamoTestTable = new sst.aws.Dynamo("DynamoTestTable", dynamoTableArgs);

    const app = new sst.aws.Nextjs("MyWeb", {
      path: "places",
      link: [
        dynamoTable,
        dynamoTestTable
      ],
      server: {
        architecture: "arm64"
      },
      imageOptimization: {
        staticEtag: true,
      }
    });

    return {
      app: app.url,
    };
  },
});
