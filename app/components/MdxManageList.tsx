'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: number;
  title: string;
  description: string;
  tags?: string[];
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog = ({ isOpen, onClose, onConfirm }: DeleteDialogProps) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
        <AlertDialogDescription>
          정말 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>취소</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>삭제</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const MdxManageList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/mdx');
      setPosts(response.data || []);
    } catch (error) {
      console.error('포스트 목록 조회 중 오류:', error);
    }
  };

  const handleDelete = async (id: number) => {
    setSelectedPostId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPostId) return;
    
    try {
      await axios.delete(`http://localhost:3000/mdx/${selectedPostId}`);
      await fetchPosts();
      setDeleteDialogOpen(false);
      toast({
        title: "삭제 완료",
        description: "게시물이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "게시물을 삭제하는 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <div 
          key={post.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <div className="flex gap-2 mt-2">
              {post.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/manage/edit/${post.id}`}
              className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              수정
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MdxManageList; 