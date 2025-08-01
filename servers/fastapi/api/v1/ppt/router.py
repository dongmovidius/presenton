from fastapi import APIRouter

from api.v1.ppt.endpoints.anthropic import ANTHROPIC_ROUTER
from api.v1.ppt.endpoints.google import GOOGLE_ROUTER
from api.v1.ppt.endpoints.openai import OPENAI_ROUTER
from api.v1.ppt.endpoints.files import FILES_ROUTER
from api.v1.ppt.endpoints.icons import ICONS_ROUTER
from api.v1.ppt.endpoints.images import IMAGES_ROUTER
from api.v1.ppt.endpoints.ollama import OLLAMA_ROUTER
from api.v1.ppt.endpoints.outlines import OUTLINES_ROUTER
from api.v1.ppt.endpoints.presentation import PRESENTATION_ROUTER
from api.v1.ppt.endpoints.slide import SLIDE_ROUTER


API_V1_PPT_ROUTER = APIRouter(prefix="/api/v1/ppt")

API_V1_PPT_ROUTER.include_router(FILES_ROUTER)
API_V1_PPT_ROUTER.include_router(OUTLINES_ROUTER)
API_V1_PPT_ROUTER.include_router(PRESENTATION_ROUTER)
API_V1_PPT_ROUTER.include_router(SLIDE_ROUTER)
API_V1_PPT_ROUTER.include_router(IMAGES_ROUTER)
API_V1_PPT_ROUTER.include_router(ICONS_ROUTER)
API_V1_PPT_ROUTER.include_router(OLLAMA_ROUTER)
API_V1_PPT_ROUTER.include_router(OPENAI_ROUTER)
API_V1_PPT_ROUTER.include_router(ANTHROPIC_ROUTER)
API_V1_PPT_ROUTER.include_router(GOOGLE_ROUTER)
