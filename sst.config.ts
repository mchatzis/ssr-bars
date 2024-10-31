/// <reference path="./.sst/platform/config.d.ts" />
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
    };
  },
  async run() {
    const dynamoTable = new sst.aws.Dynamo("DynamoTable", {
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
    });
    const app = new sst.aws.Nextjs("MyWeb", {
      path: "places",
      link: [dynamoTable],
    });
    return {
      app: app.url,
      dynamoTable: dynamoTable.name,
    };
  },
});
