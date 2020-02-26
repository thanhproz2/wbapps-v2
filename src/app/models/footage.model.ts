export class Footage {
  approvalStatus: string;
  batchId: string;
  batchName: string;
  canAssignCurator: boolean;
  canDelete: boolean;
  canPreview: boolean;
  canSubmit: boolean;
  category: string;
  createdAt: string;
  curationStatus: string;
  curator: {
    collabShare: string;
    collabType: string;
    fullName: string;
    id: string;
    locked: boolean;
  };
  description: string;
  editorial: boolean;
  editorialCity: string;
  editorialCountry: string;
  editorialDate: string;
  editorialState: string;
  editorialText: string;
  footageId: string;
  isOwner: boolean;
  keywords: string;
  memberId: string;
  noteToOwner: string;
  originalFileName: string;
  ownerFullName: string;
  ownership: number;
  projectId: string;
  sharers: [];
  submissionDate: string;
  transitionStatus: string;
  uploadedBy: string;
  documents: {
    modelDocuments: [];
    propertyDocuments: [];
  };
}
