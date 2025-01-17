import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import firebaseService from 'app/services/firebaseService';

import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {}
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter an email address')
});

const defaultValues = {
  email: ''
};

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(false);
  const classes = useStyles();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  // function onSubmit() {
  //   reset(defaultValues);
  // }

  const onSubmit = async ({ email }) => {
    try {
      await firebaseService.passwordReset(email);
      setEmailMessage(true);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('User not found, try again!');
        setEmail('');
      }
    }
  };

  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto items-center justify-center p-16 sm:p-32')}>
      <div className="flex flex-col items-center justify-center w-full">
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" />

              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Recover your password
              </Typography>
              {emailMessage ? (
                <h1>Email was sent</h1>
              ) : (
                <form
                  name="recoverForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-16"
                        label="Email"
                        autoFocus
                        type="email"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="Reset"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    type="submit"
                  >
                    Send reset link
                  </Button>
                </form>
              )}
              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <Link className="font-normal" to="/pages/auth/login">
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
