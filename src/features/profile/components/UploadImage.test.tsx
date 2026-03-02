import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UploadImage from "./UploadImage";
import { useUploadImage } from "../hooks/useUploadImage";
import { ComponentProps } from "react";

vi.mock("../hooks/useUploadImage", () => ({
  useUploadImage: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

vi.mock("lucide-react", () => ({
  Camera: () => <div data-testid="camera-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  User: () => <div data-testid="user-icon" />,
  Loader2: () => <div data-testid="loader-icon" className="animate-spin" />,
}));

describe("UploadImage", () => {
  const mockHandleFileChange = vi.fn();
  const mockHandleDeleteImage = vi.fn();

  const defaultHookReturn = {
    image: null,
    error: null,
    handleFileChange: mockHandleFileChange,
    handleDeleteImage: mockHandleDeleteImage,
    isUploading: false,
    isDeleting: false,
    uploadProgress: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUploadImage).mockReturnValue(defaultHookReturn);
  });

  it("should render placeholder icon when no image is provided", () => {
    render(<UploadImage initialImage={null} />);
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  it("should render the profile image when provided", () => {
    const imageUrl = "https://example.com/profile.jpg";
    vi.mocked(useUploadImage).mockReturnValue({
      ...defaultHookReturn,
      image: imageUrl,
    });

    render(<UploadImage initialImage={imageUrl} />);

    const img = screen.getByRole("img", { name: /profile/i });
    expect(img).toHaveAttribute("src", imageUrl);
  });

  it("should trigger file input when 'Cambiar foto' is clicked", () => {
    render(<UploadImage initialImage={null} />);

    // Accedemos al input a través del DOM para verificar el trigger
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    const changeButton = screen.getByRole("button", { name: /cambiar foto/i });
    fireEvent.click(changeButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("should call handleDeleteImage when delete button is clicked", () => {
    vi.mocked(useUploadImage).mockReturnValue({
      ...defaultHookReturn,
      image: "existing-image.jpg",
    });

    render(<UploadImage initialImage="existing-image.jpg" />);

    const deleteButton = screen.getByRole("button", { name: /eliminar/i });
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteImage).toHaveBeenCalled();
  });

  it("should show progress bar and disable buttons during upload", () => {
    vi.mocked(useUploadImage).mockReturnValue({
      ...defaultHookReturn,
      isUploading: true,
      uploadProgress: 45,
    });

    render(<UploadImage initialImage={null} />);

    expect(screen.getByText(/subiendo... 45%/i)).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cambiar foto/i }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: /eliminar/i })).toBeDisabled();
  });

  it("should display error message when validation fails", () => {
    const errorMessage = "La imagen debe pesar menos de 2MB";
    vi.mocked(useUploadImage).mockReturnValue({
      ...defaultHookReturn,
      error: errorMessage,
    });

    render(<UploadImage initialImage={null} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
