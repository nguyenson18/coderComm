import React, { useState } from "react";
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

import { FCheckbox, FormProvider, FTextField } from "../components/form";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import apiService from "../app/apiService";
import { useSnackbar } from "notistack";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [openDailog, setOpenDailog] = useState(false)
  const [email, setEmail] = useState("")
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const from = location.state?.from?.pathname || "/";
    let { email, password } = data;

    try {
      await auth.login({ email, password }, () => {
        navigate(from, { replace: true });
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  const handleSend = async() => {
    try {
      const response = await apiService.post("/users/forgotPassword", { email:email });
      if(response.success){
        setOpenDailog(false)
        enqueueSnackbar("Mật khẩu của bạn đã được reset", { variant: "success" });
      }
    } catch (error) {
      setError("responseError", error);
    }
  }
  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.responseError && (
            <Alert severity="error">{errors.responseError.message}</Alert>
          )}
          <Alert severity="info">
            Don’t have an account?{" "}
            <Link variant="subtitle2" component={RouterLink} to="/register">
              Get started
            </Link>
          </Alert>

          <FTextField name="email" label="Email address" />

          <FTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FCheckbox name="remember" label="Remember me" />
          <Typography variant="subtitle2" sx={{color:"#00AB55", cursor:"pointer"}} onClick={() => setOpenDailog(true)}>
            Forgot password?
          </Typography>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </FormProvider>
      <Dialog
        onClose={handleSend}
        open={openDailog}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
            <TextField fullWidth name="email" label="Email address" required onChange={(e) => setEmail(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> {
            setOpenDailog(false)
            setEmail('')
          }}>
            Đóng
          </Button>
          <Button onClick={handleSend}>
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LoginPage;
