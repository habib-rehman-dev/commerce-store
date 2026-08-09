import { SignUp } from "@clerk/react";

const Register = () => {
  return (
    <div className="flex justify-center p-10">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default Register;
