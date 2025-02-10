import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust the path if necessary

const VerifyAuth = () => {
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
      } else if (user) {
        console.log('Authenticated user details:', user);
      } else {
        console.log('No authenticated user found.');
      }
    };

    checkUser();
  }, []);

  return <div>Check the console for user details.</div>;
};

export default VerifyAuth;
