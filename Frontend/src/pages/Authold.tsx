// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, Eye, EyeOff } from 'lucide-react';

// const Auth = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   // const { signIn, signUp } = useAuth();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = location.state?.from?.pathname || '/';

//   const [signInData, setSignInData] = useState({
//     email: '',
//     password: '',
//   });

//   const [signUpData, setSignUpData] = useState({
//     email: '',
//     password: '',
//     fullName: '',
//     confirmPassword: '',
//   });

//   // const handleSignIn = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);

//   //   // const { error } = await signIn(signInData.email, signInData.password);

//   //   console.log(error);

//   //   if (error) {
//   //     toast({
//   //       title: "Sign in failed",
//   //       description: error,
//   //       variant: "destructive",
//   //     });
//   //   } else {
//   //     toast({
//   //       title: "Welcome back!",
//   //       description: "You have been signed in successfully.",
//   //     });
//   //     navigate('/', { replace: true });
//   //   }

//   //   setIsLoading(false);
//   // };

//   // const handleSignUp = async (e: React.FormEvent) => {
//   //   e.preventDefault();
    
//   //   if (signUpData.password !== signUpData.confirmPassword) {
//   //     toast({
//   //       title: "Passwords don't match",
//   //       description: "Please make sure your passwords match.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   setIsLoading(true);

//   //   // const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);

//   //   console.log(error);
//   //   if (error) {
//   //     toast({
//   //       title: "Sign up failed",
//   //       description: error,
//   //       variant: "destructive",
//   //     });
//   //   } else {
//   //     toast({
//   //       title: "Account created!",
//   //       description: "Please check your email to verify your account.",
//   //     });
//   //   }

//   //   setIsLoading(false);
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold text-[#bb9a65]">FurniCraft</CardTitle>
//           <p className="text-muted-foreground">Sign in to your account or create a new one</p>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="signin" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="signin">Sign In</TabsTrigger>
//               <TabsTrigger value="signup">Sign Up</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="signin">
//               <form onSubmit={handleSignIn} className="space-y-4">
//                 <div>
//                   <Label htmlFor="signin-email">Email</Label>
//                   <Input
//                     id="signin-email"
//                     type="email"
//                     value={signInData.email}
//                     onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signin-password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="signin-password"
//                       type={showPassword ? "text" : "password"}
//                       value={signInData.password}
//                       onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                   Sign In
//                 </Button>
//               </form>
//             </TabsContent>
            
//             <TabsContent value="signup">
//               <form onSubmit={handleSignUp} className="space-y-4">
//                 <div>
//                   <Label htmlFor="signup-name">Full Name</Label>
//                   <Input
//                     id="signup-name"
//                     type="text"
//                     value={signUpData.fullName}
//                     onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signup-email">Email</Label>
//                   <Input
//                     id="signup-email"
//                     type="email"
//                     value={signUpData.email}
//                     onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="signup-password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="signup-password"
//                       type={showPassword ? "text" : "password"}
//                       value={signUpData.password}
//                       onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="signup-confirm">Confirm Password</Label>
//                   <Input
//                     id="signup-confirm"
//                     type={showPassword ? "text" : "password"}
//                     value={signUpData.confirmPassword}
//                     onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                   Sign Up
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;
