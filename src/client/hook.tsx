import React, { useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { Notepad } from "./components/Notepad";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

function App() {
	const [notepadOpen, setNotepadOpen] = useState(true);

	return <Notepad isOpen={notepadOpen} onClose={() => setNotepadOpen(false)} />;
}

const container = new Instance("Folder");
container.Name = "ReactRoot";
container.Parent = playerGui;

const root = createRoot(container);
root.render(<App />);
