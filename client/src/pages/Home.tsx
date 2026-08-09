import { useSignIn } from "@clerk/react";


const Home = () => {
  // const clerk = useClerk()
  const { signIn, fetchStatus } = useSignIn();
  return (
    <div>
        <button disabled={fetchStatus == 'fetching'} onClick={() => signIn?.create({ strategy: 'oauth_google' })}>
          signIn
        </button>
    </div>
  );
};

export default Home;
