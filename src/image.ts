
export interface SanityImageCrop {
	_type?: string;
	left: number;
	bottom: number;
	right: number;
	top: number;
}

export interface SanityImageHotspot {
	_type?: string;
	width: number;
	height: number;
	x: number;
	y: number;
}

export interface SanityReference {
	_type: 'reference';
	_ref: string;
}

export interface SanityImage {
	_type: string
	asset: SanityReference
	crop?: SanityImageCrop
	hotspot?: SanityImageHotspot
}
