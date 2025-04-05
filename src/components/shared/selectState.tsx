import * as React from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

// Define the type for the configuration object
interface SelectConfig {
	label: string;
	options: Array<{ value: string; label: string }>;
}

// Configuration object for Indian states
const selectConfig: SelectConfig = {
	label: 'States in India',
	options: [
		{ value: 'andhra-pradesh', label: 'Andhra Pradesh' },
		{ value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
		{ value: 'assam', label: 'Assam' },
		{ value: 'bihar', label: 'Bihar' },
		{ value: 'chhattisgarh', label: 'Chhattisgarh' },
		{ value: 'goa', label: 'Goa' },
		{ value: 'gujarat', label: 'Gujarat' },
		{ value: 'haryana', label: 'Haryana' },
		{ value: 'himachal-pradesh', label: 'Himachal Pradesh' },
		{ value: 'jharkhand', label: 'Jharkhand' },
		{ value: 'karnataka', label: 'Karnataka' },
		{ value: 'kerala', label: 'Kerala' },
		{ value: 'madhya-pradesh', label: 'Madhya Pradesh' },
		{ value: 'maharashtra', label: 'Maharashtra' },
		{ value: 'manipur', label: 'Manipur' },
		{ value: 'meghalaya', label: 'Meghalaya' },
		{ value: 'mizoram', label: 'Mizoram' },
		{ value: 'nagaland', label: 'Nagaland' },
		{ value: 'odisha', label: 'Odisha' },
		{ value: 'punjab', label: 'Punjab' },
		{ value: 'rajasthan', label: 'Rajasthan' },
		{ value: 'sikkim', label: 'Sikkim' },
		{ value: 'tamil-nadu', label: 'Tamil Nadu' },
		{ value: 'telangana', label: 'Telangana' },
		{ value: 'tripura', label: 'Tripura' },
		{ value: 'uttar-pradesh', label: 'Uttar Pradesh' },
		{ value: 'uttarakhand', label: 'Uttarakhand' },
		{ value: 'west-bengal', label: 'West Bengal' },
	],
};

export function SelectState() {
	return (
		<Select value="tamil-nadu" defaultValue="tamil-nadu">
			<SelectTrigger className="w-32 gap-0.5 flex">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 23 23"
					fill="none"
				>
					<g clipPath="url(#clip0_15_1503)">
						<path
							d="M11.5 0C9.21344 0.00303318 7.0214 0.91271 5.40455 2.52955C3.78771 4.1464 2.87803 6.33844 2.875 8.625C2.875 14.817 10.9106 22.5723 11.252 22.8994C11.3184 22.9639 11.4074 23 11.5 23C11.5926 23 11.6816 22.9639 11.748 22.8994C12.0894 22.5723 20.125 14.817 20.125 8.625C20.122 6.33844 19.2123 4.1464 17.5954 2.52955C15.9786 0.91271 13.7866 0.00303318 11.5 0ZM11.5 12.5781C10.7181 12.5781 9.95385 12.3463 9.30376 11.9119C8.65367 11.4775 8.14699 10.8601 7.84779 10.1378C7.54859 9.41546 7.4703 8.62061 7.62283 7.85378C7.77537 7.08695 8.15186 6.38257 8.70472 5.82972C9.25757 5.27686 9.96195 4.90037 10.7288 4.74783C11.4956 4.5953 12.2905 4.67359 13.0128 4.97279C13.7351 5.27199 14.3525 5.77867 14.7869 6.42876C15.2213 7.07885 15.4531 7.84315 15.4531 8.625C15.4525 9.67324 15.0358 10.6784 14.2946 11.4196C13.5534 12.1608 12.5482 12.5775 11.5 12.5781Z"
							fill="black"
						/>
					</g>
					<defs>
						<clipPath id="clip0_15_1503">
							<rect width="23" height="23" fill="white" />
						</clipPath>
					</defs>
				</svg>
				<SelectValue
					placeholder={`Select a ${selectConfig.label.toLowerCase()}`}
				/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{selectConfig.label}</SelectLabel>
					{selectConfig.options.map((option) => {
						const isTamilNadu = option.value === 'tamil-nadu'; // Check if the current option is Tamil Nadu

						return (
							<SelectItem
								className={isTamilNadu ? 'stroke-current' : 'line-through'} // Apply strikethrough class for other states
								key={option.value}
								value={option.value}
							>
								{option.label}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
