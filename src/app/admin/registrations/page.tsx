// src/app/admin/registrations/page.tsx

import RegistrationList from '../../../components/admin/RegistrationList';

const RegistrationsPage: React.FC = () => {
  return (
    <div>
      <h1>Registrace firem</h1>
      <RegistrationList />
    </div>
  );
};

export default RegistrationsPage;