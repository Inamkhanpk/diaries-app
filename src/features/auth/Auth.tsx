import React, { FC, useState } from 'react';
import { useForm ,Controller} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';
import { User } from '../../interfaces/user.interface';


const useStyles = makeStyles((theme) => ({
   root:{
     marginTop:theme.spacing(20)
   },
   paper:{
     width:'25%',
     padding:theme.spacing(2),
     [theme.breakpoints.down('md')]: {
      width:'50%'
    },
   },
   dis:{
     margin:theme.spacing(2)
   },
   dismid:{
     display:'flex',
     justifyContent:"center",
     margin:theme.spacing(2)
   },
   disend:{
    display:'flex',
    justifyContent:"center",
    margin:theme.spacing(2),
    cursor: 'pointer', 
    opacity: 0.7 

   }

  
}));

const Auth: FC = () => {

  const classes = useStyles();

  const schema = yup.object().shape({
    username: yup.string().required('What? No username?').max(16, 'Username cannot be longer than 16 characters'),
    password: yup.string().required('Without a password, "None shall pass!"'),
    email: yup.string().email('Please provide a valid email address (abc@xy.z)'),
  });

  const { handleSubmit,register,  errors,control } = useForm<User>({
  resolver: yupResolver(schema)
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = (data: User) => {

    const path = isLogin ? '/auth/login' : '/auth/signup';
    http.post<User, AuthResponse>(path, data)
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
    <Grid container  justify="center" className={classes.root}>
      

        

         
      

       <Paper className={classes.paper}  >
       <form onSubmit={handleSubmit(onSubmit)}>
       
       <div className={classes.dis}>
       <FormControl fullWidth  variant="outlined">
         <Controller
              name="username"
              as={
                <TextField
                  id="username"
                  inputRef={register}
                  helperText={errors.username ? errors.username?.message : null}
                  variant="outlined"
                  label="Username"
                  />
              }
              control={control}
              defaultValue=""
              rules={{
                required: 'Required',
                
              }}
            />
        </FormControl>
        </div>
      
      <div className={classes.dis}>
      <FormControl fullWidth  variant="outlined">
        <Controller
              name="password"
              as={
                <TextField
                type="password"
                  id="password"
                  inputRef={register}
                  helperText={errors.password ? errors.password?.message : null}
                  variant="outlined"
                  label="Password"
                />
              }
              control={control}
              defaultValue=""
              rules={{
                required: 'Required',
               
              }}
            />
         </FormControl>
         </div>


         
          <div className={classes.dis}>
          {!isLogin && (
            <FormControl fullWidth  variant="outlined">
              <Controller
              name="email"
              as={
                <TextField
                  id="email"
                  inputRef={register}
                  helperText={errors.email ? errors.email?.message: null}
                  variant="outlined"
                  label="Email"
                  />
              }
              control={control}
              defaultValue=""
              rules={{
                required: 'Required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'invalid email address'
                }
              }}
            />
         
          </FormControl>
            )}
           </div>
           
          <div className={classes.dismid}>
            <Button type="submit" disabled={loading} variant="contained" >
              {isLogin ? 'Login' : 'Create account'}
            </Button>
          </div>
          


           
         <div className={classes.disend} >
          <Button
            onClick={() => setIsLogin(!isLogin)}
             variant="contained" type="submit"
            >
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </Button>
          </div>
          
          
          </form>

          </Paper>
          
          
  
      
    </Grid>
  );
};

export default Auth;