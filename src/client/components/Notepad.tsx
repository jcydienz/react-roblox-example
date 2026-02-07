import React, { useEffect, useState, useCallback } from "@rbxts/react";
import { RunService } from "@rbxts/services";

interface NotepadProps {
	isOpen: boolean;
	onClose: () => void;
}

// Variables / constants :) snailCase !!

const bgColor = Color3.fromRGB(22, 22, 26);
const headerColor = Color3.fromRGB(30, 30, 36);
const textColor = Color3.fromRGB(255, 255, 255);
const subtitleColor = Color3.fromRGB(140, 140, 150);
const inputBgColor = Color3.fromRGB(18, 18, 22);
const borderColor = Color3.fromRGB(50, 50, 58);
const closeButtonColor = Color3.fromRGB(60, 60, 70);
const closeButtonHoverColor = Color3.fromRGB(80, 80, 90);

const notepadWidth = 280;
const notepadHeight = 220;
const headerHeight = 40;

const animDurationIn = 0.25;
const animDurationOut = 0.15;

const easeOutCubic = (t: number): number => 1 - math.pow(1 - t, 3);
const easeInCubic = (t: number): number => t * t * t;

export const Notepad: React.FC<NotepadProps> = ({ isOpen, onClose }) => {
	const [transparency, setTransparency] = useState(1);
	const [scale, setScale] = useState(0.9);
	const [shouldRender, setShouldRender] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [noteText, setNoteText] = useState("");
	const [closeHovered, setCloseHovered] = useState(false);

	useEffect(() => {
		if (isOpen && !isClosing) {
			setShouldRender(true);
			let running = true;
			const startTime = tick();

			const connection = RunService.RenderStepped.Connect(() => {
				if (!running) {
					connection.Disconnect();
					return;
				}
				const elapsed = tick() - startTime;
				const alpha = math.clamp(elapsed / animDurationIn, 0, 1);
				const eased = easeOutCubic(alpha);

				setTransparency(1 - eased);
				setScale(0.9 + 0.1 * eased);

				if (alpha >= 1) {
					running = false;
					connection.Disconnect();
				}
			});

			return () => {
				running = false;
			};
		} else if (!isOpen && shouldRender && !isClosing) {
			setIsClosing(true);
		}
	}, [isOpen, isClosing, shouldRender]);

	useEffect(() => {
		if (!isClosing) return;

		let running = true;
		const startTime = tick();

		const connection = RunService.RenderStepped.Connect(() => {
			if (!running) {
				connection.Disconnect();
				return;
			}
			const elapsed = tick() - startTime;
			const alpha = math.clamp(elapsed / animDurationOut, 0, 1);
			const eased = easeInCubic(alpha);

			setTransparency(eased);
			setScale(1 - 0.1 * eased);

			if (alpha >= 1) {
				running = false;
				connection.Disconnect();
				setIsClosing(false);
				setShouldRender(false);
				setTransparency(1);
				setScale(0.9);
			}
		});

		return () => {
			running = false;
		};
	}, [isClosing]);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleTextChange = useCallback((rbx: TextBox) => {
		setNoteText(rbx.Text);
	}, []);

	if (!shouldRender) return undefined;

	return (
		<screengui key="NotepadGui" ResetOnSpawn={false} IgnoreGuiInset={true} DisplayOrder={15}>
			<frame
				key="Backdrop"
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.4 + transparency * 0.6}
				BorderSizePixel={0}
				Event={{
					InputBegan: (_, input) => {
						if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							handleClose();
						}
					},
				}}
			/>

			<frame
				key="Notepad"
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0, notepadWidth, 0, notepadHeight)}
				BackgroundColor3={bgColor}
				BackgroundTransparency={transparency}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, 12)} />
				<uiscale Scale={scale} />
				<uistroke Color={borderColor} Thickness={1} Transparency={transparency} />

				<frame
					key="Header"
					Size={new UDim2(1, 0, 0, headerHeight)}
					BackgroundColor3={headerColor}
					BackgroundTransparency={transparency}
					BorderSizePixel={0}
				>
					<uicorner CornerRadius={new UDim(0, 12)} />

					<frame
						key="HeaderBottom"
						Position={new UDim2(0, 0, 1, -12)}
						Size={new UDim2(1, 0, 0, 12)}
						BackgroundColor3={headerColor}
						BackgroundTransparency={transparency}
						BorderSizePixel={0}
					/>

					<frame
						key="HeaderDivider"
						Position={new UDim2(0, 0, 1, 0)}
						Size={new UDim2(1, 0, 0, 1)}
						BackgroundColor3={borderColor}
						BackgroundTransparency={transparency}
						BorderSizePixel={0}
					/>

					<textlabel
						key="Title"
						Position={new UDim2(0, 14, 0, 0)}
						Size={new UDim2(1, -50, 1, 0)}
						BackgroundTransparency={1}
						Text="Notes"
						TextColor3={textColor}
						TextTransparency={transparency}
						TextSize={15}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>

					<imagebutton
						key="CloseButton"
						AnchorPoint={new Vector2(1, 0.5)}
						Position={new UDim2(1, -10, 0.5, 0)}
						Size={new UDim2(0, 26, 0, 26)}
						BackgroundColor3={closeHovered ? closeButtonHoverColor : closeButtonColor}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Image="rbxassetid://7743878857"
						ImageColor3={textColor}
						ImageTransparency={transparency}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							MouseButton1Click: handleClose,
							MouseEnter: () => setCloseHovered(true),
							MouseLeave: () => setCloseHovered(false),
						}}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
					</imagebutton>
				</frame>

				<frame
					key="InputContainer"
					Position={new UDim2(0, 10, 0, headerHeight + 10)}
					Size={new UDim2(1, -20, 1, -headerHeight - 20)}
					BackgroundColor3={inputBgColor}
					BackgroundTransparency={transparency}
					BorderSizePixel={0}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
					<uistroke Color={borderColor} Thickness={1} Transparency={transparency} />

					<textbox
						key="NoteInput"
						Position={new UDim2(0, 10, 0, 8)}
						Size={new UDim2(1, -20, 1, -16)}
						BackgroundTransparency={1}
						Text={noteText}
						PlaceholderText="Write your notes here..."
						PlaceholderColor3={subtitleColor}
						TextColor3={textColor}
						TextTransparency={transparency}
						TextSize={13}
						Font={Enum.Font.Gotham}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
						TextWrapped={true}
						MultiLine={true}
						ClearTextOnFocus={false}
						Change={{
							Text: handleTextChange,
						}}
					/>
				</frame>
			</frame>
		</screengui>
	);
};

export default Notepad;
