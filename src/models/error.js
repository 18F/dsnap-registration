export const getError = (error, type) => (error && error[type]) || false;

export default () => ({
  server: '',
  client: '',
});