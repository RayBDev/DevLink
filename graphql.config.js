// Used for the GraphQL extension in VSCODE
// Add your schema folder and server's graphql endpoint

module.exports = {
  schema: 'server/src/schema/*.graphql',
  extensions: {
    endpoints: {
      default: {
        url: 'http://localhost:5000/graphql',
      },
    },
  },
};
