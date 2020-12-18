import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
//import * as Yup from 'yup';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
//import classes from '*.module.css';
import { makeStyles } from '@material-ui/core/styles';

// const schema = Yup.object().shape({
//   username: Yup.string()
//     .required('What? No username?')
//     .max(16, 'Username cannot be longer than 16 characters'),
//   password: Yup.string().required('Without a password, "None shall pass!"'),
//   email: Yup.string().email('Please provide a valid email address (abc@xy.z)'),
// });


const useStyles = makeStyles((theme) => ({
  root: {
    width:'25%',
    padding:theme.spacing(2),
  },
  apply:{
    marginTop:theme.spacing(24),
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  
  textfield:{
    marginTop:theme.spacing(2)
  }

  
}));

const Auth: FC = () => {
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm<User>({
    //validationSchema: schema,
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? '/auth/login' : '/auth/signup';
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      

        <form onSubmit={handleSubmit(submitForm)}>

         
      <div className={classes.apply}>

       <Paper className={classes.root}>
         
        
          <Grid item xs={12} md={12}>
            <Grid container justify="center" >
          <div className={classes.textfield}>
            <TextField
             ref={register} 
             name="username" 
             placeholder="Username" 
             />
            {errors && errors.username && (
              <p >{errors.username.message}</p>
            )}
          </div>
          </Grid>
          </Grid>


          <Grid item xs={12} md={12}>
            <Grid container justify="center">
          <div className={classes.textfield}>
            <TextField
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p >{errors.password.message}</p>
            )}
          </div>
          </Grid>
          </Grid>


          {!isLogin && (
            <Grid item xs={12} md={12}>
            <Grid container justify="center">
            <div className={classes.textfield}>
              <TextField
                ref={register}
                name="email"
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p >{errors.email.message}</p>
              )}
            </div>
            </Grid>
            </Grid>
          )}

           <Grid item xs={12} md={12}>
            <Grid container justify="center">
          <div className={classes.textfield}>
            <Button type="submit" disabled={loading} variant="contained">
              {isLogin ? 'Login' : 'Create account'}
            </Button>
          </div>
          </Grid>
            </Grid>


            <Grid item xs={12} md={12}>
            <Grid container justify="center">
              <div className={classes.textfield}>
          <Button
            onClick={() => setIsLogin(!isLogin)}
             variant="contained"
            >
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </Button>
          </div>
          </Grid>
            </Grid>
          
         

          </Paper>
          </div>
          
        </form>
      
    </div>
  );
};

export default Auth;