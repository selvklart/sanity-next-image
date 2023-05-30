import {createContext, PropsWithChildren, useContext} from 'react';

export interface SanityProjectDetails {
	projectId: string;
	dataset: string;
}

const SanityProjectDetailsContext = createContext<SanityProjectDetails | null>(null);

/**
 * Returns the SanityProjectDetails provided by a SanityProjectDetailsProvider
 * further up in the document hierarchy.
 */
export function useSanityProjectDetails(): SanityProjectDetails {
	const projectDetails = useContext(SanityProjectDetailsContext);

	if (!projectDetails) {
		throw new Error('useProjectDetails must be used within ClientProvider');
	}

	return projectDetails;
}

type SanityProjectDetailsProviderProps = {
	projectDetails: SanityProjectDetails
}

/**
 * Makes a SanityProjectDetails object available to components in the child hierarchy.
 *
 * Use the useSanityProjectDetails hook to access the object.
 */
export default function SanityProjectDetailsProvider({children, projectDetails}: PropsWithChildren<SanityProjectDetailsProviderProps>) {
	return (
		<SanityProjectDetailsContext.Provider value={projectDetails}>
			{children}
		</SanityProjectDetailsContext.Provider>
	);
}
