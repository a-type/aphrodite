import CustomerMutations from '../generated/CustomerMutations';
import Employee from '../generated/Employee';
import EmployeeMutations from '../generated/EmployeeMutations';
import setup from './setup';

const ctx = setup();

test('creating some nodes', async () => {
  const employee = await Employee.queryAll(ctx).take(1).genxOnlyValue();
  const [handle] = CustomerMutations.create(ctx, {
    email: 'foo@bar.com',
    firstName: 'Foo',
    lastName: 'Bar',
    supportRep: employee,
  }).save();
  await handle;
});
