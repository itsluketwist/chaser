import createService from './index';

const usersService = {
  getUser: (params) => ({
    method: 'get',
    url: '/users/me',
    ...params,
  }),

  updateUser: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/me',
    data,
    ...params,
  }),

  updatePassword: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/password',
    data,
    ...params,
  }),
};

export default createService(usersService);