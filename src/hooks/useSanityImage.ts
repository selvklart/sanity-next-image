import {useMemo} from 'react';
import {SanityImage, SanityProjectDetails, getSanityImage} from '../sanity';

/**
 * Hook resolving the URL and width/height of the image passed in.
 *
 * It obeys the crop rectangle set on the image in Sanity, but it's also
 * possible to set a desired aspect-ratio to futher crop the image.
 */
export default function useSanityImage(projectDetails: SanityProjectDetails, image: SanityImage, aspectRatio?: number) {
	const sanityImage = useMemo(
		() => getSanityImage(projectDetails, image, aspectRatio),
		[projectDetails, image, aspectRatio]
	);

	return sanityImage;
}
