'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowUpRightIcon, BoxSelectIcon, CropIcon, DownloadCloudIcon, File, Folder, Grid, Grid2X2, Info, InfoIcon, ListMinus, LucideDelete, MoreVertical, PenBoxIcon, ScreenShareIcon, Settings2Icon, Share2Icon, Trash2Icon, ViewIcon, X, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSearchStore } from "@/components/remember/rememberState";

export type FilesProps = {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  path: string;
  size: number;
  numItems: number;
  uri: string | null;
  children: FilesProps[] | null;
}

export type FileExtend = {
  contents: FilesProps[];
}

export default function Home() {
  const { searchQueryState } = useSearchStore();
  const [files, setFiles] = useState<FilesProps[]>([]);
  const [folderBread, setFolderBread] = useState<string[]>(['root']);
  const [currentFiles, setCurrentFiles] = useState<FilesProps[]>([]);

  const [selectedFile, setSelectedFile] = useState<string>('')

  useEffect(() => {
    async function fetchFiles() {
      const response = await fetch('api/prometheus/files');
      const data = await response.json();
      setFiles(data.contents);
      setCurrentFiles(data.contents);
    }
    fetchFiles();
  }, []);

  const addItem = (item: string, newFiles: FilesProps[]) => {
    setFolderBread(prev => [...prev, item]);
    setCurrentFiles(newFiles);
  };

  const removeItem = (item: string) => {
    const index = folderBread.indexOf(item);
    if (index !== -1) {
      const newBreadcrumb = folderBread.slice(0, index + 1);
      setFolderBread(newBreadcrumb);

      // Navigate to the correct folder
      const newCurrentFiles = findFolderContents(files, newBreadcrumb.slice(1));
      setCurrentFiles(newCurrentFiles);
    }
  };

  const findFolderContents = (filesList: FilesProps[], path: string[]): FilesProps[] => {
    if (path.length === 0) return filesList;

    const folder = filesList.find(f => f.isDirectory && f.name === path[0]);
    if (folder && folder.children) {
      return findFolderContents(folder.children, path.slice(1));
    }
    return [];
  };

  const filteredFiles = currentFiles?.filter(file =>
    file.name.toLowerCase().includes(searchQueryState.toLowerCase())
  );

  const sortedFiles = [
    ...filteredFiles.filter(file => file.isDirectory),
    ...filteredFiles.filter(file => file.isFile)
  ];

  return (
    <ContextMenu>
      <section className="container flex flex-1 flex-col min-h-screen w-screen gap-5">
        <div className="flex flex-row max-w-full w-full items-center justify-between">
          <div className="flex flex-row">
            <Breadcrumb>
              <BreadcrumbList>
                {folderBread.map((item, index) => (
                  <div key={index} className="flex flex-row items-center cursor-pointer">
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => removeItem(item)}>
                        {item}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < folderBread.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-row gap-2">
            <Button
              variant={"destructive"}
              size={"icon"}
              className="rounded-full"
            >
              <ListMinus />
            </Button>

            <Button
              variant={"destructive"}
              size={"icon"}
              className="rounded-full"
            >
              <Grid />
            </Button>

            <Button
              variant={"destructive"}
              size={"icon"}
              className="rounded-full"
            >
              <Grid2X2 />
            </Button>
          </div>
        </div>

        <Dialog>
          <ContextMenuTrigger
            id="container-contents"
            asChild
            className="flex flex-col max-h-full max-w-full min-h-full w-full h-full z-0"
            onKeyUp={(event) => event.stopPropagation()}
          >
            <div className="flex flex-1 flex-col">
              <div className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-9 gap-2 max-w-full w-full">
                {sortedFiles?.map((item, index) => (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger id={`card-trigger-${index}`} className="flex flex-col h-fit no-select z-30"
                      onKeyUp={(event) => event.stopPropagation()}>
                      <Card
                        onClick={() => {
                          if (item.isDirectory && item.children) {
                            addItem(item.name, item.children);
                          }
                        }}
                        className="flex flex-col h-fit items-center md:border-0 hover:rounded-lg  hover:bg-muted/20 bg-muted/0 rounded-[0px]">
                        <CardContent className="relative p-5">
                          <Image
                            alt={item.name}
                            width={1000}
                            height={1000}
                            src={item.uri != null ? item.uri : item.isDirectory ? '/@base-icons/folder_icon.png' : '/@base-icons/office_notes.png'}
                            className="w-[55px] h-[50px] md:w-[250px] md:h-[90px]"
                          />
                          {item.isDirectory ? (
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              className="absolute rounded-full top-1 bg-muted/55"
                            >
                              {item.numItems}
                            </Button>
                          ) : ("")}
                        </CardContent>
                        <CardFooter className="flex flex-col items-center">
                          <Label>{item.name}</Label>
                        </CardFooter>
                      </Card>
                    </ContextMenuTrigger>

                    <ContextMenuContent id={`card-trigger-${index}`} className="w-52 rounded-[10px]"
                      onKeyUp={(event) => event.stopPropagation()}>
                      <ContextMenuGroup>
                        {item.isFile ? (
                          <DialogTrigger asChild onClick={() => { item.uri != undefined ? setSelectedFile(item.uri?.toString()) : "" }}>
                            <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                              Preview
                              <ScreenShareIcon />
                            </ContextMenuItem>
                          </DialogTrigger>
                        ) : ""}

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Edit
                          <PenBoxIcon size={20} />
                        </ContextMenuItem>

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Copy
                          <PenBoxIcon size={20} />
                        </ContextMenuItem>

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Download
                          <DownloadCloudIcon size={20} />
                        </ContextMenuItem>

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Share
                          <ArrowUpRightIcon size={20} />
                        </ContextMenuItem>
                      </ContextMenuGroup>
                      <ContextMenuSeparator />

                      <ContextMenuGroup>
                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Get information
                          <InfoIcon size={20} />
                        </ContextMenuItem>

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Remove
                          <LucideDelete size={20} />
                        </ContextMenuItem>

                        <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
                          Permanently Delete
                          <Trash2Icon size={20} />
                        </ContextMenuItem>
                      </ContextMenuGroup>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </div>
          </ContextMenuTrigger>

          <DialogContent className="flex flex-col h-[95%] min-w-[98%]">
            {sortedFiles.filter((e) => e.uri?.includes(selectedFile)).map((item, index) => (
              <div key={index} className="flex flex-col size-full">
                <header className="sticky top-0 z-50 w-full border-b-0 border-border/10 bg-background/35 backdrop-blur supports-[backdrop-filter]:bg-background/35">
                  <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start h-full">
                      <Label className="mr-6 flex text-2xl font-bold items-center space-x-2">
                        {item.name}
                      </Label>
                    </div>

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center">
                      <nav className="flex items-center justify-center gap-5">
                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <Info size={15} />
                        </Button>
                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <Share2Icon size={15} />
                        </Button>
                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <Trash2Icon size={15} />
                        </Button>

                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <ZoomOutIcon size={15} />
                        </Button>
                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <ZoomInIcon size={15} />
                        </Button>

                        <span className="w-1 bg-accent h-8 rounded-full" />

                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <CropIcon size={15} />
                        </Button>
                      </nav>
                    </div>

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                      <nav className="flex items-center gap-2">
                        <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                          <MoreVertical size={15} />
                        </Button>

                        <DialogClose>
                          <Button variant={"ghost"} size={"icon"} className="rounded-full bg-muted/50">
                            <X size={15} />
                          </Button>
                        </DialogClose>
                      </nav>
                    </div>
                  </div>
                </header>
                <div className="relative flex flex-col size-full">
                  <Image
                    key={index}
                    alt={item.name}
                    width={1080}
                    height={720}
                    src={selectedFile}
                    className="object-scale-down h-full w-full"
                  />
                </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>

        <ContextMenuContent id="container-contents" className="w-52 rounded-[10px]"
          onKeyUp={(event) => event.stopPropagation()}>
          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            File settings
            <Settings2Icon size={20} />
          </ContextMenuItem>

          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            Select All
            <BoxSelectIcon size={20} />
          </ContextMenuItem>

          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            Paste
            <PenBoxIcon size={20} />
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            Hidden files
            <ViewIcon size={20} />
          </ContextMenuItem>

          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            New File
            <File size={20} />
          </ContextMenuItem>

          <ContextMenuItem className="flex flex-row items-center justify-between rounded-[0px]">
            New Folder
            <Folder size={20} />
          </ContextMenuItem>

          <ContextMenuItem className="flex flex-col bg-muted/100 items-start gap-2 w-full rounded-[10px]">
            <Label className="text-sm font-bold">Storage Size</Label>
            <div className="flex flex-row w-full flex-wrap gap-2">
              <Progress value={20} className="rounded-[100px] h-3" />
              <Label className="">20 GB</Label>
              <Label className="">Available</Label>
            </div>
          </ContextMenuItem>
        </ContextMenuContent>
      </section>
    </ContextMenu>
  );
}
