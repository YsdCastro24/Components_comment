import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "timeago.js";
import { faker } from "@faker-js/faker";
import EmojiPicker from "emoji-picker-react";

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker] = useState(false);
  const [emojiPickers, setEmojiPickers] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const addComment = () => {
    if (newComment.trim().length < 3) {
      setError("El comentario debe tener al menos 3 caracteres");
      return;
    }

    const comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
      emoji: "👍",
      avatar: `https://i.pravatar.cc/80?u=${Date.now()}`,
      name: faker.person.firstName()
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setError("");
  };

  const handleLike = (commentId) => {
    setEmojiPickers((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleEmojiSelect = (emojiObject, commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, emoji: emojiObject.emoji, liked: true }
        : comment
    ));
    setEmojiPickers((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0B1422] rounded-2xl shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Comentarios</h2>
      
      <div className="mb-6 relative">
        <textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[100px] resize-y text-black"
        />
        
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 bg-white p-2 rounded-lg shadow-lg z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          onClick={addComment}
          className="mt-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition duration-200 ease-in-out w-full md:w-auto"
        >
          Publicar comentario
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 pb-16">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border border-[#111C2D] bg-[#0B1422] rounded-2xl p-5 animate-pulse">
                  <div className="w-16 h-16 bg-gray-600 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="relative">
                <ul className={`mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 pb-16 transition-all ${!showAll ? 'max-h-[400px] overflow-hidden' : ''}`}>
                  {(showAll ? comments : comments.slice(0, 6)).map((comment) => (
                    <motion.li 
                      key={comment.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 0.3 }}
                      className="border border-[#111C2D] bg-[#0B1422] rounded-2xl p-5 break-inside-avoid mb-7"
                    >
                      <header className="flex items-center gap-2.5">
                        <img src={comment.avatar} alt="Avatar del usuario" loading="lazy" width="80" height="80" className="w-16 aspect-square rounded-full object-cover" />
                        <div>
                          <h3 className="text-lg font-semibold">{comment.name}</h3>
                          <p className="text-white/60">{format(comment.date)}</p>
                        </div>
                      </header>
                      <p className="text-white/70 mt-2.5">{comment.text}</p>
                      <div className="flex justify-between items-center mt-4 relative">
                        <motion.button
                          onClick={() => handleLike(comment.id)}
                          className="text-white/60 hover:text-blue-500"
                          whileTap={{ scale: 0.9 }}
                        >
                          {comment.emoji}
                        </motion.button>
                        {emojiPickers[comment.id] && (
                          <div className="absolute bottom-10 left-0 bg-white p-2 rounded-lg shadow-lg z-10">
                            <EmojiPicker onEmojiClick={(emojiObject) => handleEmojiSelect(emojiObject, comment.id)} />
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
                {!showAll && comments.length > 6 && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1422] to-transparent pointer-events-none"></div>
                )}
              </div>
              {comments.length > 6 && (
                <button
                onClick={() => setShowAll(!showAll)}
                className="py-2.5 px-4 justify-center rounded-[10px] font-bold border flex items-center gap-x-2.5 leading-none hover:scale-105 transition-transform duration-300 shadow-button bg-brand-blue text-white border-brand-blue absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                {showAll ? "Ver menos" : "Ver más"}
              </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;