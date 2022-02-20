import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import { signIn, useSession } from "next-auth/react";
import useSWR, { useSWRConfig } from "swr";
import { Snackbar } from "@/components/Snackbar";
import Image from "next/image";
import { signOut } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import ContentLoader from "react-content-loader";
import fetcher from "lib/fetcher";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

function GuestbookEntry({ entry, user }) {
    const { mutate } = useSWRConfig();
    const deleteEntry = async (e) => {
        e.preventDefault();
        await fetch(`/api/guestbook/${entry.id}`, {
            method: "DELETE",
        });

        mutate("/api/guestbook");
    };
    const { t } = useTranslation();

    return (
        <div className="flex flex-col space-y-2">
            <div className="prose w-full dark:prose-dark">{entry.body}</div>
            <div className="flex items-center space-x-3">
                <p className="text-sm text-gray-500">{entry.created_by}</p>
                <span className=" text-gray-200 dark:text-gray-800">/</span>
                <p className="text-sm text-gray-400 dark:text-gray-600">
                    {format(
                        new Date(entry.updated_at),
                        "d MMM yyyy 'at' h:mm bb",
                    )}
                </p>
                {user && entry.created_by === user.name && (
                    <>
                        <span className="text-gray-200 dark:text-gray-800">
                            /
                        </span>
                        <button
                            className="text-sm text-red-600 dark:text-red-400"
                            onClick={deleteEntry}
                        >
                            {t("guestbook:delete")}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Guestbook({ fallbackData }) {
    const { theme, resolvedTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [dark, setDark] = useState();
    const { data: session } = useSession();
    const { mutate } = useSWRConfig();
    const inputEl = useRef(null);
    const { data: entries } = useSWR("/api/guestbook", fetcher, {
        fallbackData,
    });
    const { t } = useTranslation();

    const leaveEntry = async (e) => {
        e.preventDefault();

        if (inputEl.current.value !== "") {
            setLoading(true);
            const res = await fetch("/api/guestbook", {
                body: JSON.stringify({
                    body: inputEl.current.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });

            const { error } = await res.json();
            if (error) {
                Snackbar(error, "error");
                return;
            }

            inputEl.current.value = "";
            mutate("/api/guestbook");
            Snackbar(t("guestbook:success"), "success");
            setLoading(false);
        } else {
            Snackbar(t("guestbook:error"), "error");
        }
    };

    useEffect(() => {
        setDark(theme === "dark" || resolvedTheme === "dark");
    }, [resolvedTheme, theme]);

    const containerStyle = {
        position: "relative",
        width: "1rem",
        height: "1rem",
        boxSizing: "border-box",
        margin: "0 auto",
    };

    const circleStyle = {
        display: "block",
        width: "1rem",
        height: "1rem",
        border: "3px solid #e9e9e9",
        borderTop: "3px solid #ff4532",
        borderRadius: "50%",
        position: "absolute",
        boxSizing: "border-box",
        top: 0,
        left: 0,
    };

    const spinTransition = {
        repeat: Infinity,
        ease: "linear",
        duration: 1,
    };

    return (
        <>
            <div className="my-4 w-full max-w-2xl rounded border border-gray-200 bg-gray-100 p-6 dark:border-gray-800 dark:bg-gray-800">
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100 md:text-xl">
                    {session?.user
                        ? t("guestbook:guestbook")
                        : t("guestbook:signInGuestbook")}
                </h5>
                {!session && (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages
                    <a
                        href="/api/auth/signin/github"
                        className="my-4 flex h-8 w-28 items-center justify-center rounded bg-red-500 font-bold text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            signIn("github");
                        }}
                    >
                        {t("guestbook:signIn")}
                    </a>
                )}
                {session?.user && (
                    <form
                        className="my-4 flex items-center"
                        onSubmit={leaveEntry}
                    >
                        <input
                            ref={inputEl}
                            aria-label={t("guestbook:yourComment")}
                            placeholder={t("guestbook:placeholder")}
                            required
                            className="mr-3 block h-10 w-full rounded-md border-2 border-red-500 bg-white py-2 px-4 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-[#2d2d2d] dark:text-gray-100"
                        />
                        <button
                            className="h-10 w-28 rounded bg-gray-200 px-4 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                            type="submit"
                        >
                            {loading ? (
                                <div style={containerStyle}>
                                    <motion.span
                                        style={circleStyle}
                                        animate={{ rotate: 360 }}
                                        transition={spinTransition}
                                    />
                                </div>
                            ) : (
                                t("guestbook:sign")
                            )}
                        </button>
                    </form>
                )}

                <p className="text-sm text-gray-800 dark:text-gray-200">
                    {t("guestbook:tip")}
                </p>

                {session?.user && (
                    <div className="my-4 flex items-center">
                        <div className="mr-3 flex w-full items-center gap-x-2">
                            <Image
                                src={session.user.image}
                                width={48}
                                height={48}
                                alt="User avatar"
                                className="rounded-full"
                            />
                            <span>{session.user.name}</span>
                        </div>
                        <button
                            className="h-10 w-28 rounded bg-gray-200 px-4 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                            onClick={signOut}
                        >
                            {t("guestbook:signOut")}
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-4 space-y-8">
                {loading && (
                    <ContentLoader
                        speed={0.5}
                        width={340}
                        height={30}
                        viewBox="0 0 340 30"
                        backgroundColor={dark ? "#2e2e2e" : "#efefef"}
                        foregroundColor={dark ? "#333333" : "#eaeaea"}
                    >
                        <rect
                            x="0"
                            y="0"
                            rx="3"
                            ry="3"
                            width="70"
                            height="10"
                        />
                        <rect
                            x="76"
                            y="0"
                            rx="3"
                            ry="3"
                            width="140"
                            height="10"
                        />
                        <rect
                            x="0"
                            y="20"
                            rx="3"
                            ry="3"
                            width="140"
                            height="10"
                        />
                    </ContentLoader>
                )}
                {entries?.map((entry) => (
                    <GuestbookEntry
                        key={entry.id}
                        entry={entry}
                        user={session?.user}
                    />
                ))}
            </div>
        </>
    );
}
