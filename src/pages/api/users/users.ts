import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const user = [
    {
      name: 'guilherme',
      email: 'kanekibr.kb@gmail.com'
    }
  ]

  return response.json(user);
}