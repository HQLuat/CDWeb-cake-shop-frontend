import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../app/hooks";
import { loginWithGoogle } from "./authThunk";
import { useNavigate } from "react-router-dom";

interface GoogleButtonProps {
  onError: () => void;
}

function GoogleButton({ onError }: GoogleButtonProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      onError();
      return;
    }

    try {
      const result = await dispatch(
        loginWithGoogle({ idToken })
      ).unwrap();
      if (result.success) {
        const role = result.data?.role;
        navigate(role === "ADMIN" ? "/admin/analytics" : "/home");
      } else {
        onError();
      }
    } catch {
      onError();
    }
  };

  return (
    <div className="relative w-10 h-10 overflow-hidden rounded-full">
      {/* Nút custom đẹp mắt hiển thị cho người dùng */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm pointer-events-none">
        <FontAwesomeIcon icon={faGoogle} />
      </div>

      {/* Nút Google thật sự từ thư viện, nằm đè lên trên và ẩn đi bằng opacity-0 */}
      <div className="absolute inset-0 opacity-0 cursor-pointer scale-150 origin-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={onError}
          type="icon"
          shape="circle"
        />
      </div>
    </div>
  );
}

export default GoogleButton;

