"use client"
import NotFoundComponent from '@/components/NotFound'
import { useTheme } from 'next-themes'

export default function NotFound() {
    const { theme } = useTheme();
    const bg = `bg-${theme === 'dark' ? 'secondary' : 'white'}`
    return (
        <div className={`${bg} min-h-screen flex flex-col items-center justify-center`} suppressHydrationWarning>
            {/* <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link> */}
            <div className="flex flex-col gap-4 items-center justify-center">

                <NotFoundComponent color={theme === 'dark' ? 'white' : 'red'}>
                    404 Not Found
                </NotFoundComponent>

                <div className="cursor-pointer text-lg">
                    <a className="text-blue-600" href={"/"}>
                        Return to Home
                    </a>
                </div>
            </div>

        </div>
    )
}