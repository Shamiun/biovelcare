"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useQuery } from 'convex/react';
// import { api } from '../../../convex/_generated/api';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FileText, Loader2 } from 'lucide-react';

const SearchCommand = ({ open, onOpenChange }) => {
  const router = useRouter();
//   const allPosts = useQuery(api.posts.listAll);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (slug) => {
    router.push(`/post/${slug}`);
    onOpenChange(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      router.push(`/search/${encodeURIComponent(inputValue.trim())}`);
      onOpenChange(false);
    }
  };

  // Effect to clear input when dialog closes
  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className='top-40'>
      <CommandInput 
        placeholder="Search something..." 
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        {/* {allPosts === undefined && (
          <div className="p-4 text-center text-sm"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>
        )} */}
        <CommandEmpty>No results found.</CommandEmpty>
        {/* <CommandGroup heading="Suggestions">
          {allPosts?.slice(0, 5).map(post => (
            <CommandItem key={post._id} onSelect={() => handleSelect(post.slug)} value={post.title} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>{post.title}</span>
            </CommandItem>
          ))}
        </CommandGroup> */}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;