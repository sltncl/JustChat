import React from "react";
import SignUpForm from "../components/SignUpForm";
import { Stack } from "@mui/system";


const SignUpPage = () => {
   return (
      <Stack height='100vh' width='100vw' justifyContent='center' alignItems='center'>
         <SignUpForm />
      </Stack>
   );
};

export default SignUpPage;
