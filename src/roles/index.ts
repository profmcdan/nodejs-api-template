import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

ac.grant('user').createOwn('user').readOwn('user').updateOwn('user').deleteOwn('user');

ac.grant('admin').extend('user').createAny('user').readAny('user').updateAny('user').deleteAny('user');

// freeze our policy
ac.lock();

console.log(ac.can('user').updateAny('user').granted);

export default ac;
