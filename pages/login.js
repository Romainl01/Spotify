import {getProviders, signIn} from 'next-auth/react'

function Login({providers}) {
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
          <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="test" />
        {Object.values(providers).map((providers) => (
            <div key={providers.name}>
                <button className="bg-[#18D860] text-white p-5 rounded-lg"
                onClick={() => signIn(providers.id, {callbackUrl: '/'})}
                >Login with {providers.name}</button>
            </div>))}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        }
    }
}