export const generateToken = (email: string, id: string) => {
  return Buffer.from(`${email}_${id}`).toString('base64');
};

export const decodeToken = (token: string) => {
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [email, id] = decoded.split('_');
  return { email, id };
};
