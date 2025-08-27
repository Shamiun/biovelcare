// components/Search/SearchCommand.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";

const SearchCommand = ({ open, onOpenChange }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    // When the user presses Enter and the input is not empty...
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // ...navigate to the search page with the input value as a query parameter.
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      onOpenChange(false); // Close the dialog
    }
  };

  // Effect to clear the input field when the dialog is closed
  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="top-40">
      <CommandInput 
        placeholder="Search for a product..." 
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={handleKeyDown}
      />
      {/* <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList> */}
    </CommandDialog>
  );
};

export default SearchCommand;
