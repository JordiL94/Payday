import * as React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login, signup } from '../store/user.action.js';

const theme = createTheme();
function _LoginSignup({ login, signup }) {
	let history = useHistory();
	
	const demoBoardId = '61f8f86b25bd9487389b2907'
	
	const location = useLocation();
	const isSignUp = location.pathname !== '/login';
	
	function getPath() {
		return isSignUp ? '/login' : '/signup';
	}
	
	const handleSubmit = async (ev) => {
		ev.preventDefault();
		const data = new FormData(ev.currentTarget);
		if (isSignUp) {
			const user = {
				fullname: `${data.get('firstName')} ${data.get('lastName')}`,
				username: data.get('username'),
				password: data.get('password'),
			};
			signup(user);
			history.push(`/board/${demoBoardId}/board`);
		} else {
			const user = {
				username: data.get('username'),
				password: data.get('password'),
			};
			try {
				await login(user);
				setTimeout(() => {
					history.push(`/board/${demoBoardId}/board`);
				}, 1000);
			} catch {
				console.log('not allowed');
			}
		}
	};
	
	const responseGoogle = async (response) => {
		const userObj = response.profileObj;
		const googleUser = {
			fullname: userObj.name,
			username: userObj.email,
			imgUrl: userObj.imageUrl,
			mentions: [],
			createsAt: Date.now(),
			password: response.tokenId,
		};
		try {
			await login({
				username: googleUser.username,
				password: googleUser.password,
			});
			history.push(`/board/${demoBoardId}/board`);
		} catch {
			await signup(googleUser);
			history.push(`/board/${demoBoardId}/board`);
		}
	};
	
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						{isSignUp ? 'Sign up' : 'Login'}
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							{isSignUp && (
								<React.Fragment>
									<Grid item xs={12} sm={6}>
										<TextField
											autoComplete="given-name"
											name="firstName"
											required
											fullWidth
											id="firstName"
											label="First Name"
											autoFocus
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											fullWidth
											id="lastName"
											label="Last Name"
											name="lastName"
											autoComplete="family-name"
										/>
									</Grid>
								</React.Fragment>
							)}
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							{isSignUp ? 'Sign up' : 'login'}
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link to={getPath} variant="body2">
									{isSignUp
										? 'Already have an account? Login'
										: "Don't have an account? Sign up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
					<GoogleLogin
						className="google-signin-btn"
						clientId="586771329018-j784f66o5gjvidjg8a7siqq7ffhr50v1.apps.googleusercontent.com"
						onSuccess={responseGoogle}
						cookiePolicy={'single_host_origin'}
					/>
				</Box>
			</Container>
			<Link className='back-home-link' to='/'>⬅Back to home</Link>
		</ThemeProvider>
	);
}
function mapStateToProps({ userModule }) {
	return {
		user: userModule.user,
	};
}
const mapDispatchToProps = {
	login,
	signup,
};
export const LoginSignup = connect(
	mapStateToProps,
	mapDispatchToProps
)(_LoginSignup);