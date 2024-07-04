'use client'

import { ApertureIcon, MicIcon, SearchIcon, Settings2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useSearchStore } from "../remember/rememberState"

export const Header = () => {
    const { searchQueryState, setSearchQuery } = useSearchStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b-0 border-border/10 bg-background/0 backdrop-blur supports-[backdrop-filter]:bg-background/0">
            <div className="flex flex-col items-center justify-center max-w-full p-5">
                <div className="flex flex-row w-full md:max-w-2xl items-center bg-muted/100 rounded-full p-2">
                    <div className="flex flex-row gap-2 z-10">
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="rounded-full"
                        >
                            <SearchIcon size={18} />
                        </Button>
                    </div>

                    <Input
                        placeholder="search"
                        value={searchQueryState}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex flex-row text-lg focus-visible:ring-0 w-full max-w-full" />

                    <div className="flex flex-row gap-2 z-10">
                        <Button
                            variant={"destructive"}
                            size={"icon"}
                            className="rounded-full"
                        >
                            <ApertureIcon size={18} />
                        </Button>

                        <Button
                            variant={"destructive"}
                            size={"icon"}
                            className="rounded-full"
                        >
                            <Settings2Icon size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}