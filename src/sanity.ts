import imageUrlBuilder from '@sanity/image-url';

export interface SanityProjectDetails {
	projectId: string;
	dataset: string;
}

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
	asset: SanityReference // FIXME: This may be undefined, which should be represented by the type.
	crop?: SanityImageCrop
	hotspot?: SanityImageHotspot
}

export const getSanityImage = (projectDetails: SanityProjectDetails, image: SanityImage, aspectRatio?: number) => {
	// First find the natural width and height from the asset ID. This
	// seems a bit hacky, but it's the same thing next-sanity-image
	// does, so it's likely to be the correct way of doing it. If we
	// couldn't parse the size form the ID we would have to do another
	// request to fetch the asset document, which would be annoying.
	const dimensions = image.asset._ref.split('-')[2];
	let [width, height] = dimensions.split('x').map((num) => parseInt(num, 10));

	// If the image has been cropped, adjust the width and height to
	// the cropped size:
	const crop = image.crop;
	if (crop) {
		width = Math.round(width * (1 - (crop.left + crop.right)));
		height = Math.round(height * (1 - (crop.top + crop.bottom)));
	}

	// If the user asked for a different aspect ratio, shrink either
	// the height or width depending on whether the image should be
	// wider or more narrow than it naturally is:
	if (aspectRatio) {
		const naturalAspectRatio = width / height;

		if (aspectRatio > naturalAspectRatio) {
			height = Math.round(width / aspectRatio);
		} else {
			width = Math.round(height * aspectRatio);
		}
	}

	const src = imageUrlBuilder(projectDetails)
		.image(image)
		.width(width)
		.height(height)
		.url();

	return {
		src,
		width,
		height
	};
};
