"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./page.module.css";
import { IReqAuth } from "./services/collection/auth/IEntityAuth";
import { getLocalStorage, setLocalStorage } from "./utils";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type TCurrentState = "login" | "signup" | "librian";
type TError = {
  emailError: boolean;
  passwordError: boolean;
  fullNameError: boolean;
};
export default function SignIn() {
  const router = useRouter();
  const [condition, setCondition] = React.useState<TCurrentState>("login");
  const [emailErrorMsg, setEmailErrorMsg] = React.useState<string>(
    "Email Address must include @gmail.com"
  );
  const [error, setError] = React.useState<TError>({
    emailError: false,
    passwordError: false,
    fullNameError: false,
  });

  React.useEffect(()=>{
    const userData = getLocalStorage('user');
    if(userData){
      router.push('/home');
    }
  },[])


  const errorHandler = (success: boolean, data?: IReqAuth | string) => {
    if (success) {
      setLocalStorage("user", data);
      router.push("/home");
    } else {
      setError((prev) => ({ ...prev, emailError: true }));
      data && typeof data === "string" && setEmailErrorMsg(data);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    if (data.get("email") === "") {
      setEmailErrorMsg("Email Address must include @gmail.com")
      return setError((prev) => ({ ...prev, emailError: true }));
    }
    if (data.get("password") === "") {
      return setError((prev) => ({ ...prev, passwordError: true }));
    }
    if (data.get("fullName") === "") {
      return setError((prev) => ({ ...prev, fullNameError: true }));
    }
    if (error.emailError || error.passwordError || error.fullNameError) {
      return;
    }

    const obj: IReqAuth = {
      email: data.get("email")?.toString() || "",
      password: data.get("password")?.toString() || "",
      fullName: data.get("fullName")?.toString() || "",
      func: condition,
    };
    if (condition === "librian") {
      setLocalStorage("user", "librian");
      return router.push("/home");
    }

    await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(obj),
    }).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (!data.from) {
          if (condition === "login") {
            errorHandler(true, data);
          } else if (condition === "signup") {
            errorHandler(
              false,
              "Email already exists,please login to continue"
            );
          }
        } else {
          if (condition === "login") {
            errorHandler(false, "Your email does not exists in the database");
          } else if (condition === "signup") {
            errorHandler(true, obj);
          }
        }
      }
    });
  };

  const TextChange = React.useCallback(() => {
    if (condition === "login") {
      return ["User Login", "User Signup", "Are you Librian?"];
    } else if (condition === "signup") {
      return ["User Signup", "User Login", "Are you Librian?"];
    } else {
      return ["Libraian Login", "User Login", "User Signup"];
    }
  }, [condition]);

  const changeLink = React.useCallback(
    (from: number) => {
      if (condition === "login") {
        return from === 0 ? "signup" : "librian";
      } else if (condition === "signup") {
        return from === 0 ? "login" : "librian";
      } else {
        return from === 0 ? "login" : "signup";
      }
    },
    [condition]
  );

  const ErrorHandler = (from: "email" | "password" | "fullName", data: any) => {
    if(emailErrorMsg !== 'Email Address must include @gmail.com'){
      setEmailErrorMsg('Email Address must include @gmail.com')
    }
    if (from === "email") { 
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
      setError((prev) => ({ ...prev, emailError: !gmailRegex.test(data) }));
    } else if(from === 'fullName'){
      setError((prev) => ({ ...prev, fullNameError: data === '' }));
    }
     else {
      setError((prev) => ({
        ...prev,
        passwordError: data === "",
      }));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {TextChange()[0]}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              error={error.emailError}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => ErrorHandler("email", e.target.value)}
              helperText={error.emailError && emailErrorMsg}
            />
            {
              condition === "signup" && (
                <TextField
                  error={error.fullNameError}
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="fullName"
                  onChange={(e) => ErrorHandler("fullName", e.target.value)}
                  helperText={error.fullNameError && "Full Name is required"}
                />
              )
            }
            <TextField
              error={error.passwordError}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => ErrorHandler("password", e.target.value)}
              helperText={error.passwordError && "You must enter your password"}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {condition === "signup" ? "Sign Up" : "Sign in"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Button onClick={() => setCondition(`${changeLink(0)}`)}>
                  <Link href="#" variant="body2">
                    {TextChange()[1]}
                  </Link>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => setCondition(changeLink(1))}>
                  <Link variant="body2">{TextChange()[2]}</Link>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
