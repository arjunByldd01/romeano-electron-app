export const apiHeaders = ({ userAPIKey }: { userAPIKey: string }) => {
  return {
    'X-Romeano-Api-Key': userAPIKey,
  };
};
